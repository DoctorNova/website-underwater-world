import {useI18n} from "@game/App/Hooks/useI18n.ts";

export function MyEmail() {
    const { t } = useI18n();
    const myEmail = t("myEmail");

    return (
        <a className="hover:text-cyan-300" href={`mailto:${myEmail}`}>{myEmail}</a>
    );
}