import { Link } from "@game/App/Components/Link";
import { useI18n } from "@game/App/Hooks/useI18n.ts";

export function MyEmail() {
    const { t } = useI18n();
    const myEmail = t("myEmail");

    return (
      <Link href={`mailto:${myEmail}`}>{myEmail}</Link>
    );
}