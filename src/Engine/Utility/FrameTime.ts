class FrameTime {
  private time: number = 0
  private deltaTime: number = 0

  public Update(now: number) {
    const newTime = now * 0.001;
    // make sure delta time isn't too big.
    this.deltaTime = Math.min(newTime - this.time, 1 / 20);
    this.time = newTime;
  }

  public get Time(): number {
    return this.time;
  }

  public get DeltaTime(): number {
    return this.deltaTime;
  }
}

export const globalFrameTime = new FrameTime();