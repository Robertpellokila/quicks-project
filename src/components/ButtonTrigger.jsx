import React from 'react'

const ButtonTrigger = ({onclick, title}) => {
  return (
    <button onClick={onclick} className=" cursor-pointer transition-all bg-blue-500 text-white px-4 py-1 rounded-lg border-blue-600 border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
      {title}
    </button>
  )
}

export default ButtonTrigger
