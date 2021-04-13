const stuff = require('./genres');
let genres = stuff.genres; 

export const autoComplete = (input) => {
    let currentFocus;
    input.addEventListener('input', function(e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if(!val) 
            return false;
        currentFocus = -1;
        a = document.createElement('div');
        a.setAttribute('id', this.id + 'autocomplete-list');
        a.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(a);
        for(i = 0 ; i < genres.length ; i++) {
            if(genres[i].genre.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                b = document.createElement('div');
                b.innerHTML = `<strong>${genres[i].genre.substr(0, val.length)}</strong>`;
                b.innerHTML += genres[i].genre.substr(val.length);
                b.innerHTML += `<input type="hidden" value="${genres[i].genre}"/>`;
                b.addEventListener('click', function(e) {
                    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    nativeInputValueSetter.call(input, this.getElementsByTagName('input')[0].value);
                    var ev2 = new Event('input', { bubbles: true});
                    input.dispatchEvent(ev2);
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }

    });
    input.addEventListener('keydown', function(e) {
        let x = document.getElementById(this.id + 'autocomplete-list');
        if(x)
            x = x.getElementsByTagName('div');
        if(e.keyCode === 40) {
            currentFocus++;
            addActive(x);
        } else if(e.keyCode === 38) {
            currentFocus--;
            addActive(x);
        } else if(e.keyCode === 13) {
            e.preventDefault();
            if(currentFocus > -1) {
                if(x) 
                    x[currentFocus].click();
            }
        }
    });
    const addActive = (x) => {
        if(!x)
            return false;
        removeActive(x);
        if(currentFocus >= x.length)
            currentFocus = 0;
        if(currentFocus < 0)
            currentFocus = (x.length - 1);
        x[currentFocus].classList.add('autocomplete-active');
    }
    const removeActive = (x) => {
        for(let i = 0 ; i < x.length ; i++) {
            x[i].classList.remove('autocomplete-active');
        }
    }
    const closeAllLists = (element) => {
        let x = document.getElementsByClassName('autocomplete-items');
        for(let i = 0 ; i < x.length ; i++) {
            if(element !== x[i] && element != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener('click', function(e) {
        closeAllLists(e.target);
    });
}


