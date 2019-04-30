'use strict';

const searchURL = 'https://developer.nps.gov/api/v1/parks';
const apiKey = "2mAtvFkzMAOF1BIiLu7gTRlHhIsDlMcgeum29Pex";

function formatQueryParams(params){
    const queryItems = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    for (let i=0; i < responseJson.data.length; i++){
        $('#results-list').append(
            `<li><a href="${responseJson.data[i].url}">${responseJson.data[i].fullName}</a>
            <p>${responseJson.data[i].description}<p>

            </li>`
        )};
    $('#results').removeClass('hidden');
    console.log(responseJson.data[0].url);
};

function getParks(query, maxResults=10) {
    const params = {
        api_key: apiKey,
        stateCode: query,
        limit: maxResults-1
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    console.log(url);
    const request = new Request(url, {
        headers: new Headers({
          'X-Api-Key': apiKey
        })
    });
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Soemthing went wrong: ${err.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const stateSelect = $('#js-desired-states').val();
        const maxResults = $('#js-max-results').val();
        getParks(stateSelect, maxResults);
    });
}

$(watchForm)