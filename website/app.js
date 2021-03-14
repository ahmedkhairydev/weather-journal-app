/* Global Variables */
let zip = document.getElementById('zip'),
    btn = document.getElementById('generate'),
    feelings = document.getElementById('feelings'),
    entryHolder = document.getElementById('entryHolder'),
    c = document.getElementById('c'),
    f = document.getElementById('f');

// Personal API Key for OpenWeatherMap API
const mainURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const APIKey = '5dcf0b4fc5ee9b571166ccb66db35332';

// Create a new date instance dynamically with JS
let date = new Date();
let newDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();


/* Function to POST data */
const setTemp = async (url = ``, data = {}) => {
    console.log(data);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log("error", error);
    }
}

/* Function to GET Web API Data*/
const getTemp = () => {
    let units = c.checked ? c.value : f.value;
    fetch(`${mainURL}${zip.value},us&appid=${APIKey}&units=${units}`).then(result => {
        return result.json();
    }).then(data => {
        if (data.cod === 200) {
            console.log(data);
            let temp = data.main.temp + ` °${c.checked ? 'C' : 'F'}`;
            const body = {
                zip: zip.value,
                temp,
                date: newDate,
                feelings: feelings.value ? feelings.value : '-'
            };

            // call the setTemp function
            setTemp('/setTemp', body).then(() => {
                zip.value = '';
                btn.setAttribute('disabled', null);
                getAllTemp();
            });
        } else if(data.cod == "404") {
            alert(data.message);
        }
    });
}

/* Function to GET Project Data */
const getAllTemp = async () => {
    const request = await fetch('/getAllTemp');

    try {
        const allData = await request.json();
        entryHolder.innerHTML = null;
        
        allData.temps.map(data => {
            let div = document.createElement('div');
            let content = `
                <div class="each-col date">
                    <label>Zipcode</label>
                    <span>${data.zip}</span>
                </div>
                
                <div class="each-col date">
                    <label>Date</label>
                    <span>${data.date}</span>
                </div>
                
                <div class="each-col temp">
                    <label>Temp</label>
                    <span>${data.temp}</span>
                </div>
                
                <div class="each-col message">
                    <label>Message</label>
                    <span>${data.feelings}</span>
                </div>
            `;
            div.classList.add('each-row');
            div.innerHTML = content;

            entryHolder.appendChild(div);
        });

    } catch (error) {
        console.log("error", error);
    }
}

getAllTemp();

// get Temp when click
// Event listener to add function to existing HTML DOM element
btn.addEventListener('click', getTemp);

// stop write 'e' word
// Event listener to add function to existing HTML DOM element
zip.addEventListener('keydown', ($event) => {
    if($event.keyCode === 69) {
        $event.preventDefault();
    }
});

// remove disabled attr. from the btn
// Event listener to add function to existing HTML DOM element
zip.addEventListener('input', ($event) => {
    if($event.target.value.length) {
        btn.removeAttribute('disabled');
    } else {
        btn.setAttribute('disabled', null);
    }
});