import classNames from 'classnames'
import { ComponentProps, FC } from 'react'

const AppPage: FC<ComponentProps<'div'>> = ({ children, className }) => {
  return <div className={classNames('p-4 md:p-8', className)}>{children}</div>
}

export default AppPage
