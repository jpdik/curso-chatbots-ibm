import React from 'react'

export default props => (
    <div className="top_menu">
        <div className="buttons">
            <div className="button close">✖</div>
            <div className="button minimize">▬</div>
            <div className="button maximize">■</div>
        </div>
        <div className="title">{props.nome}</div>
    </div>
)

