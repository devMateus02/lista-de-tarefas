import React from "react";
function Botao(props) {
  return (
    <button className="px-[10px] py-[5px] bg-blue-600 rounded-[10px] cursor-pointer font-[500]"  onClick={props.funcao}>
      {props.titulo}
    </button>
  );
}



export default Botao