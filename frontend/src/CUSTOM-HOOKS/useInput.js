import { useState } from "react";

const useInput=(validate , initialState)=>
{
      const[value , setValue] = useState(initialState);
      const[isValid , setIsValid] = useState(true);

      const valueChangeHandler=(e)=>
      {
         if(validate(e.target.value))
         {
            setValue(e.target.value);

            setTimeout(()=>{
               setIsValid(true);
            },200);
            
            return;
         }

            setValue(e.target.value);
            setTimeout(()=>{
               setIsValid(false);
            }, 200);
            
      } 

      const clear=()=>
      {
         setValue("");
      }

      return {value , isValid , valueChangeHandler , clear};
};

export default useInput;