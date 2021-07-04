import React, { useState } from 'react';
import axios from 'axios';

function RunUI()
{

    var bp = require('./Path.js');
    var storage = require('../tokenStorage.js');
    const jwt = require("jsonwebtoken");
    
    var run = '';
    var search = '';

    const [message,setMessage] = useState('');
    const [searchResults,setResults] = useState('');
    const [runList,setRunList] = useState('');

    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    // var userId = ud.id;
    // var firstName = ud.firstName;
    // var lastName = ud.lastName;
    var userId = 12;
    var firstName = "firstname";
    var lastName = "lastname";
	
    const addRun = async event => 
    {
	    event.preventDefault();

        var tok = storage.retrieveToken();
       var obj = {userId:userId,run:run.value,jwtToken:tok};
       var js = JSON.stringify(obj);

        var config = 
        {
            method: 'post',
            url: bp.buildPath('api/addrun'),	
            headers: 
            {
                'Content-Type': 'application/json'
            },
            data: js
        };
    
        axios(config)
            .then(function (response) 
        {
            var res = response.data;
            var retTok = res.jwtToken;
    
            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                setMessage('Run has been added');
                storage.storeToken( {accessToken:retTok} );
            }
        })
        .catch(function (error) 
        {
            console.log(error);
        });

	};

    const searchRun = async event => 
    {
        event.preventDefault();
        		
        var tok = storage.retrieveToken();
        var obj = {userId:userId,search:search.value,jwtToken:tok};
        var js = JSON.stringify(obj);

        var config = 
        {
            method: 'post',
            url: bp.buildPath('api/searchruns'),	
            headers: 
            {
                'Content-Type': 'application/json'
            },
            data: js
        };
    
        axios(config)
            .then(function (response) 
        {
            var res = response.data;
            var retTok = res.jwtToken;
    
            if( res.error.length > 0 )
            {
                setMessage( "API Error:" + res.error );
            }
            else
            {
                var _results = res.results;
                var resultText = '';
                for( var i=0; i<_results.length; i++ )
                {
                    resultText += _results[i];
                    if( i < _results.length - 1 )
                    {
                        resultText += ', ';
                    }
                }
                setResults('Run(s) have been retrieved');
                setRunList(resultText);
                storage.storeToken( {accessToken:retTok} );
            }
        })
        .catch(function (error) 
        {
            console.log(error);
        });

    };

    return(
        <div className="homepage-subsection" id="run-ui-div">
        <br />
        <div className="input-field">
            <input type="text" id="search-text" placeholder="Run To Search For" 
                ref={(c) => search = c} />
            <button type="button" id="searchRunButton" className="buttons" 
                onClick={searchRun}> Search Run</button><br />
            <span id="runSearchResult">{searchResults}</span>
        </div>
        <div className="input-field">
            <p id="runList">{runList}</p>
            <input type="text" id="run-text" placeholder="Run To Add" 
                ref={(c) => run = c} />
            <button type="button" id="addRunButton" className="buttons" 
                onClick={addRun}> Add Run </button><br />
            <span id="runAddResult">{message}</span>
        </div>
        
        
        </div>
    );
}

export default RunUI;
