// ==UserScript==
// @name         Nexusmods - Untrack all
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Nexusmods-Untrack-All/raw/master/nexusmods-untrack-all.user.js
// @version      1.0
// @description  Untrack all tracked mods on Nexusmods
// @author       LenANderson
// @match        https://www.nexusmods.com/mods/trackingcentre*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const wait = async(millis)=>(new Promise(resolve=>setTimeout(resolve,millis)));

    const untrackAll = async()=>{
        let link = document.querySelector('.toggle-track-mod');
        if (link) {
            while (link) {
                console.log('clicking ', link);
                link.click();
                let popupFound = false;
                while (!popupFound) {
                    console.log('waiting for popup');
                    await wait(100);
                    const popup = document.querySelector('.popup-js');
                    const h2 = document.querySelector('.popup-js h2');
                    const copy = document.querySelector('.popup-js .info  > .flex-copy');
                    popupFound = (h2 && h2.textContent.trim() == 'Success' && copy && copy.textContent.search('You are no longer tracking') > -1);
                }
                document.querySelector('.popup-js .mfp-close').click();
                link = document.querySelector('.toggle-track-mod');
            }
            console.log('clicked all links on the page');
            location.reload();
        } else {
            console.log('no links found');
            alert('no more tracked mods found');
            localStorage.removeItem('untrackAll');
        }
    };

    const startUntrackAll = ()=>{
        localStorage.setItem('untrackAll', 1);
        untrackAll();
    };

    const init = async()=>{
        if (localStorage.getItem('untrackAll')) {
            let spinnerAppeared = false;
            let spinnerDisappeared = false;
            while (!spinnerAppeared) {
                console.log('waiting for spinner');
                await wait(100);
                spinnerAppeared = document.querySelector('.nexus-ui-blocker .loading-wheel') != null;
            }
            console.log('spinner appeared');
            while (!spinnerDisappeared) {
                console.log('waiting for spinner to disappear');
                await wait(100);
                spinnerDisappeared = document.querySelector('.nexus-ui-blocker .loading-wheel') == null;
            }
            console.log('spinner disappeared');
            untrackAll();
        } else {
            const btn = document.createElement('button'); {
                btn.textContent = 'Untrack All';
                btn.style.fontSize = '20px';
                btn.style.fontFamily = 'monospace';
                btn.style.color = 'black';
                btn.style.margin = '0 0 0px 20px';
                btn.style.verticalAlign = 'middle';
                btn.addEventListener('click', evt=>{
                    evt.preventDefault();
                    evt.stopPropagation();
                    startUntrackAll();
                });
                document.querySelector('#featured > h1').appendChild(btn);
            }
        }
    };
    init();
})();
