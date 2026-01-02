import {useI18n} from "@game/App/Hooks/useI18n.ts";

export function MyEmail() {
    const { t } = useI18n();
    const myEmail = t("myEmail");

    return (
        <a href={`mailto:${myEmail}`}>{myEmail}</a>
    );
}