import classNames from "classnames";
import styles from './index.module.scss';
import { useTranslation } from "react-i18next";
import Tips from "../Tips";


const displayTagList = [
  "supply-limited",
  // "out-of-length-range",
  // "invalid",
  // "duplicate",
  "layer-1-asset",
  "layer-2-asset",
  // "verified-on-platform",
  // "unnamed",
  // "supply-unlimited",

  "rgbpp-compatible",
  "rgb++",
  // "suspicious",
  // "utility",
]

const resolveTag = (tagName: string) => {
  return displayTagList.find(tag => tagName === tag);

}


type UDTTagProps = {
  tagName: string;
  tooltip?: boolean;
}


export default function TokenTag(props: UDTTagProps) {
  const { tagName: propsTagName, tooltip } = props;
  const tagName = resolveTag(propsTagName);
  const { t } = useTranslation();
  if (!tagName) return null;

  if (tooltip) {
    return (
      <Tips
        asChild
        placement="bottom"
        trigger={
          <div
            className={classNames(styles.tag)}
            data-type={tagName}
          >
            {t(`xudt.tags.${tagName}`)}
          </div>
        }
      >
        <div className="whitespace-normal max-w-[320px]">
          {t(`xudt.tags_description.${tagName}`)}
        </div>
      </Tips>
    )
  }

  return (
    <div
      className={classNames(styles.tag)}
      data-type={tagName}
    >
      {t(`xudt.tags.${tagName}`)}
    </div>
  )
}