precision mediump float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec3 iCameraForward;
uniform vec3 iCameraUp;
uniform vec3 iCameraPosition;
uniform vec3 iSunDirection; // normalized, world space
uniform float iDeepSeeDepth;

varying vec3 vPositionInCamera;
varying vec2 vUV;

#define PI 3.14159265358979323846

float rayStrength(
    vec2 raySource,
    vec2 rayRefDirection,
    vec2 fragCoord,
    float seedA,
    float seedB,
    float speed)
{
  vec2 sourceToCoord = fragCoord - raySource;

  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);

  float value =
      (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
      (0.3  + 0.2  * cos(-cosAngle * seedB + iTime * speed));

  float x = clamp(value, 0.0, 1.0);

  return x * clamp(
      (iResolution.x - length(sourceToCoord)) / iResolution.x,
      0.0, 1.0
  );
}

vec2 GetSunScreenPos(vec3 sunDirView)
{
  vec2 dir = sunDirView.xy;
  float len = length(dir);
  dir = (len > 1e-4) ? dir / len : vec2(0.0, -1.0);

  // Project sun outside the screen
  return 0.5 * iResolution + dir * iResolution.y * -0.8;
}

vec3 WorldToView(vec3 dir)
{
  vec3 forward = normalize(iCameraForward);
  vec3 right   = normalize(cross(forward, iCameraUp));
  vec3 up      = normalize(cross(right, forward));

  return vec3(
      dot(dir, right),
      dot(dir, up),
      dot(dir, forward)
  );
}

// Inspiration
// https://youtu.be/tjlKG-5Ng78?t=211
// https://youtu.be/SIeOl92px08?t=425
vec4 GodRays(vec2 fragCoord)
{
  vec3 sunDirView = WorldToView(normalize(iSunDirection));

  // Sun visibility
  float visibility = smoothstep(-0.1, 0.3, sunDirView.z);
  if (visibility <= 0.001)
      return vec4(0.0);

  vec2 rayDir = sunDirView.xy;
  float len = length(rayDir);
  rayDir = (len > 1e-4) ? rayDir / len : vec2(0.0, -1.0);

  vec2 raySource = GetSunScreenPos(sunDirView);
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

  vec4 rays = vec4(1.0) * rayStrength(
      raySource,
      rayDir,
      coord,
      36.2214,
      21.11349,
      1.5
  );

  // Depth-based tint (unchanged)
  float brightness = 1.0 - coord.y / iResolution.y;
  rays.rgb *= vec3(
      0.1 + brightness * 0.8,
      0.3 + brightness * 0.6,
      0.5 + brightness * 0.5
  );

  // To avoid harsh cutoffs when the sun leaves the screen
  float edgeFade = smoothstep(
    1.0, 0.7,
    length((raySource - 0.5 * iResolution) / iResolution)
  );

  rays *= edgeFade;

  return rays * visibility;
}

void main()
{
  vec3 deepSeaColor = vec3(12.0, 17.0, 69.0) / 255.0;
  vec3 surfaceSeaColor = vec3(0.0, 255.0, 205.0) / 255.0;
  vec3 twilightZoneSeaColor = vec3(0.0, 0.0, 55.0) / 255.0; // Very dark blue

  vec2 ndc = vUV * 2.0 - 1.0;

  vec3 cameraUp = iCameraUp;
  vec3 cameraForward = iCameraForward;
  vec3 cameraRight = normalize(cross(cameraForward, cameraUp));

  // Find where this pixel is on the sphere surrounding the camera
  vec3 sphereCoordinate = normalize(cameraForward + cameraRight * ndc.x + cameraUp * ndc.y);

  // Change from surface color to deep sea color based on whether we are looking up or down
  float viewFactor = sphereCoordinate.y * 0.5 + 0.3; // sphereCoordinate.y is [-1, 1] and convert to [0, 1]
  vec3 waterColor = mix(deepSeaColor, surfaceSeaColor, viewFactor);

  // Change the water background color based on the depth of the camera
  float depthFactor = clamp(cameraPosition.y / iDeepSeeDepth, -1.0, 0.0) + 1.0; // 1 is surface color and 0 deep sea color
  vec3 background = mix(twilightZoneSeaColor, waterColor, depthFactor);
  
  // Rays are always coming from above
  vec4 rays = GodRays(gl_FragCoord.xy);
  vec3 finalColor = background + rays.rgb * rays.a;
  gl_FragColor = vec4(finalColor, 1.0);
}