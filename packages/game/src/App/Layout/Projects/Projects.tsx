import { Button } from "@game/App/Components/Button";
import { FilterDropDown } from "@game/App/Components/FilterDropdown";
import { I18nText } from "@game/App/Components/I18nText";
import { useI18n } from "@game/App/Hooks/useI18n";
import { ContentSection } from "@game/App/Layout/Content/ContentSection";
import { cn } from "@game/App/utils";
import { Download, ExternalLink } from "lucide-react";
import { useCallback, useState } from "preact/hooks";
import projectsJson from './Data/projects.json';

interface ProjectData {
  "name": string,
  "description": string,
  "image": string,
  "technologies": string[],
  "featured"?: boolean,
  "role"?: string,
  "links": Partial<{
    "website": string,
    "steam": string,
    "download": {
      "windows": string,
      "linux": string,
    },
    "video": string
  }>
}

const PROJECTS = projectsJson as ProjectData[];
const ALL_TECHNOLOGIES = PROJECTS.flatMap((value) => value.technologies).reduce((filtered, value) => {
  if (filtered.indexOf(value) != -1) {
    return filtered;
  }

  filtered.push(value);
  return filtered;
}, new Array<string>());

export function ProjectsSection() {
  const { t } = useI18n();
  const [filteredProjects, setFilteredProjects] = useState(PROJECTS);

  const onFiltered = useCallback((filter: string) => {
    const lowerCaseFilter = filter.toLocaleLowerCase();
    const matchingProjects = PROJECTS.filter((project) => {
      const t = project.technologies.join(" ").toLocaleLowerCase();
      return t.includes(lowerCaseFilter);
    });
    setFilteredProjects(matchingProjects);
  }, []);

  return (
    <ContentSection title="portfolio">
      <FilterDropDown items={ALL_TECHNOLOGIES} placeholder="filter-by-technology" onFiltered={onFiltered} />

      {/* Projects Count */}
      {filteredProjects.length != PROJECTS.length && (
        <p className="text-blue-200 text-sm mb-4">
          {t("showingResults")}: {filteredProjects.length} {filteredProjects.length === 1 ? t("project") : t("projects")}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          return (
            <div
              key={project.name}
              className="backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300 group flex flex-col"
            >
              {/* Project Image */}
              <div className="w-full h-48 overflow-hidden bg-gray-900 relative">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Project Info */}
              <div className="p-6 flex flex-col grow bg-[#16293d]/95">
                <h3 className="text-white mb-2">{project.name}</h3>

                <div className="mb-3 space-y-1">
                  <p className={cn("text-orange-300 text-sm", !project.role && 'hidden')}>
                    <span className="font-semibold">{t("role")}:</span> {project.role}
                  </p>
                  <p className="text-blue-200 text-sm">
                    <span className="font-semibold">{t("technologies")}:</span> {project.technologies.join(", ")}
                  </p>
                </div>

                <p className="text-blue-100 text-sm mb-4 grow">
                  {t(project.description)}
                </p>

                <div className="flex w-full justify-between">
                  {project.links?.download && (
                    <a href={project.links.download.windows} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <I18nText id="download" />
                      </Button>
                    </a>
                  )}
                  {project.links?.website && (
                    <a href={project.links.website} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs sm:text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <I18nText id="website" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </ContentSection>
  )
}