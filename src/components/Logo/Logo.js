import React from "react"
import LogoImage from "../../assets/image/burger-logo.png"
import styles from "./Logo.module.css"

const logo = (props) => {
    return <div className={styles.Logo} style={{height: props.height}}>
        <img src={LogoImage} alt="Burger"/>
    </div>
}

export default logo;