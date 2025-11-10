import classNames from "classnames";
import styles from "./SortButton.module.scss";
import SortListIcon from "@/components/icons/sortList"


export type SortValue = `${string}.${"asc" | "desc"}` | ""

type SortButtonProps = {
  className?: string;
  fieldName: string;
  defaultValue?: SortValue;
  onChange: (sort: SortValue) => void;
}

export default function SortButton(props: SortButtonProps) {
  const { fieldName, defaultValue, onChange, className } = props;
  const [currentSortKey, orderBy] = defaultValue?.split(".") ?? [];
  const isActive = currentSortKey === fieldName;
  const changeSort = () => {
    if(!isActive) {
      onChange(`${fieldName}.desc`)
    }
    if(defaultValue === `${fieldName}.desc`) {
      onChange(`${fieldName}.asc`)
    }
    if(defaultValue === `${fieldName}.asc`) {
      onChange("")
    }
    
  }
  return (
    <button
      type="button"
      className={classNames(styles.container, className)}
      data-order={isActive ? orderBy : null}
      onClick={changeSort}
    >
      <SortListIcon />
    </button>
  );
}