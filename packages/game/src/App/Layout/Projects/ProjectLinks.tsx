import { Button } from "@game/App/Components/Button";
import { useI18n } from "@game/App/Hooks/useI18n";
import type { ProjectData } from "@game/App/Layout/Projects/Projects";
import { Download, Globe } from "lucide-react";

export function ProjectLinks({ website, steam, download }: ProjectData["links"]) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap gap-2">

      {/* Download Windows - Icon Button */}
      {download?.windows && (
        <a
          href={download.windows}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-2"
          title={t("downloadWindows")}
        >
          <Button className="rounded-full text-xs font-medium bg-[#0078d4] text-white hover:text-white border-[#0078d4]">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Windows</span>
          </Button>
        </a>
      )}

      {/* Download Linux - Icon Button */}
      {download?.linux && (
        <a
          href={download.linux}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-2"
          title={t("downloadLinux")}
        >
          <Button className="rounded-full text-xs font-medium bg-[#fcc624] hover:bg-[#f9b208] text-black hover:text-black ">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Linux</span>
          </Button>
        </a>
      )}

      {/* Steam Link - Icon Button */}
      {steam && (
        <a
          href={steam}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-2"
          title={t("steam")}
        >
          <Button className="rounded-full text-xs font-medium bg-black hover:bg-[#2a475e] text-white border-black">
            <a className="w-4 h-4" title="Steam, Public domain, via Wikimedia Commons"><img width="960" alt="Steam official logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/960px-Steam_icon_logo.svg.png"></img></a>
            <span className="hidden sm:inline">Steam</span>
          </Button>
        </a>
      )}

      {/* Website Link - Icon Button */}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 py-2"
          title={t("website")}
        >
          <Button className="rounded-full text-xs font-medium">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{t("website")}</span>
          </Button>
        </a>
      )}

    </div>);
}