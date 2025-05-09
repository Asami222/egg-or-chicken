import * as React from 'react'

interface SeparatorProps {
  children?: React.ReactNode
}

const Separator = ({children}: SeparatorProps) => {
  return (
    <div className='my-6 h-[22px] text-sm text-slate-400 flex items-center before:flex-1 before:border-[0.5px] before:border-solid before:border-slate-400 before:mr-[.50em]
    after:flex-1 after:border-[0.5px] after:border-solid after:border-slate-400 after:ml-[.50em]'>
      {children}
    </div>
  )
}

export default Separator