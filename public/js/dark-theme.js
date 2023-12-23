// function myChangeMode(){
//     var body=document.body;


//     // toggle the theme
//     // body.classList.toggle("my-dark-theme-class");
//     body.classList.toggle("")
//     // body.classList.add("my-dark-theme-class");


//     let button=document.getElementById("dark-mode-btn");
//     button.classList.toggle("my-dark-theme-class");

//     // change btn text
//     if(button.innerHTML=="Dark Mode")
//     button.innerHTML="Normal Mode";
//     else
//     button.innerHTML="Dark Mode";
// }


// from bootstrap

/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
*/

function changeMode2(){
    let body=document.body;
    body.dataset.bsTheme=body.dataset.bsTheme=="light"?"dark":"light";
    // body.data-bs-theme=body.data-bs-theme=="light"?"dark":"light";

    let button=document.getElementById("dark-mode-btn");
    if(button.innerHTML=="Light Mode")
    {
      // button.color="red";
      button.classList.remove("light-btn-bg");
      button.classList.add("dark-btn-bg");
      // button.background-color="white";
      button.innerHTML="Dark Mode";
    }
    else{
      button.innerHTML="Light Mode";
      // button.classList.toggle("dark-btn-bg");
      button.classList.remove("dark-btn-bg");
      button.classList.add("light-btn-bg");
      
    }
    
}


const changeMode=() => {
    'use strict'
  
    const getStoredTheme = () => localStorage.getItem('theme')
    const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
    const getPreferredTheme = () => {
      const storedTheme = getStoredTheme()
      if (storedTheme) {
        return storedTheme
      }
  
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  
    const setTheme = theme => {
      if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }
  
    setTheme(getPreferredTheme())
  
    const showActiveTheme = (theme, focus = false) => {
      const themeSwitcher = document.querySelector('#bd-theme')
  
      if (!themeSwitcher) {
        return
      }
  
      const themeSwitcherText = document.querySelector('#bd-theme-text')
      const activeThemeIcon = document.querySelector('.theme-icon-active use')
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
      const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')
  
      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
        element.setAttribute('aria-pressed', 'false')
      })
  
      btnToActive.classList.add('active')
      btnToActive.setAttribute('aria-pressed', 'true')
      activeThemeIcon.setAttribute('href', svgOfActiveBtn)
      const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
      themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)
  
      if (focus) {
        themeSwitcher.focus()
      }
    }
  
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const storedTheme = getStoredTheme()
      if (storedTheme !== 'light' && storedTheme !== 'dark') {
        setTheme(getPreferredTheme())
      }
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme())
  
      document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value')
            setStoredTheme(theme)
            setTheme(theme)
            showActiveTheme(theme, true)
          })
        })
    
    })
}