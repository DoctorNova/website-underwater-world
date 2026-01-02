import {useI18n} from "@game/App/Hooks/useI18n.ts";

type I18nTextProps = {
    id: string;
}

export function I18nText({ id }: I18nTextProps) {
    const { t } = useI18n();
    return <>{t(id)}</>;
}