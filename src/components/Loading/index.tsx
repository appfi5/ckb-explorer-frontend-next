import classNames from 'classnames';
import { Orbit } from 'ldrs/react'
import 'ldrs/react/Orbit.css'
import type { ComponentProps } from 'react'
import { useTheme } from '../Theme';


type LoadingProps = ComponentProps<'div'> & {
  show?: boolean;
}

export default function Loading(props: LoadingProps) {
  const { className, show = true, ...rest } = props;
  const [theme] = useTheme();
  if (!show) return null;
  return (
    <div {...rest} className={classNames("flex items-center justify-center", className)}>
      <Orbit
        size="35"
        speed="1.5"
        color={theme === "dark" ? "var(--color-primary)" : "black"}
      />
    </div>
  )
}
