import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import Card from '../components/card'; // Assuming the component is named Card and the file is Card.js

const App = () => {
  const inputData = useRef();
  const [tweets, setTweets] = useState([]);
  const [mostDuplicates, setMostDuplicates] = useState([]);

  const [showCards, setShowCards] = useState(false);


  const fetchData = (userName) => {
    let data = JSON.stringify({
      query: `query {
        tweetsByUserName(userName: "${userName}") {
          id
          createdAt
          text
          user {
            id
            userName
          }
        }
      }`,
      variables: {}
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://app.codescreen.com/api/assessments/gql/tweets',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 8c5996d5-fb89-46c9-8821-7063cfbc18b1'
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        setShowCards(true)
        setTweets(response.data.data.tweetsByUserName);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    fetchData(inputData.current.value);
  };
  let result;
  let result2;
  let result3;
  useEffect(() => {
    let hashTags = tweets?.map(tweet => tweet?.text.split("#")).flat();
    let tweetsInDay = tweets?.map(tweet => tweet?.createdAt.split("T")[0]);;
    result = findMostDuplicates(hashTags);
    result2 = findMostDuplicatedLength(tweetsInDay);
    result3 = getMaxDayGap(tweetsInDay)
    setMostDuplicates([result[0], result2, result3]);

  }, [tweets]);

  function findMostDuplicates(arr) {
    let frequencyMap = {};
    let maxFrequency = 0;
    let mostDuplicates = [];

    arr.forEach(item => {
      frequencyMap[item] = (frequencyMap[item] || 0) + 1;
      if (frequencyMap[item] > maxFrequency) {
        maxFrequency = frequencyMap[item];
        mostDuplicates = [item];
      } else if (frequencyMap[item] === maxFrequency) {
        mostDuplicates.push(item);
      }
    });

    return mostDuplicates;
  }

  function findMostDuplicatedLength(arr) {
    const frequencyMap = {};
    arr.forEach(element => {
      if (frequencyMap[element]) {
        frequencyMap[element]++;
      } else {
        frequencyMap[element] = 1;
      }
    });

    let maxFrequency = 0;
    for (const key in frequencyMap) {
      if (frequencyMap[key] > maxFrequency) {
        maxFrequency = frequencyMap[key];
      }
    }
    return maxFrequency;
  }
  function getMaxDayGap(days) {
    const timestamps = days.map(day => new Date(day).getTime());

    timestamps.sort((a, b) => a - b);

    const dayGaps = [];
    for (let i = 1; i < timestamps.length; i++) {
      dayGaps.push(timestamps[i] - timestamps[i - 1]);
    }

    const maxDayGapInMilliseconds = Math.max(...dayGaps);

    const maxDayGapInDays = maxDayGapInMilliseconds / (24 * 60 * 60 * 1000);

    return maxDayGapInDays;
  }




  return (
    <div className='parent_container'>
      <p className="tweets-analysis-service">Tweets Analysis Service</p>
      <form onSubmit={submitHandler} id='input-form'>
        <input ref={inputData} type='text' id='input-box' />
        <input type="submit" value="Submit" />
      </form>

      <div className='cardContainer'>
        {showCards ? (
          <>
            <Card name="Most Popular Hashtags" id="most-popular-hashtag" value={mostDuplicates[0] || "N/A"} />
            <Card name="Most Tweets in one day" id="most-tweets" value={mostDuplicates[1] || "N/A"} />
            <Card name="Longest Tweet ID" id="longest-tweet-id" />
            <Card name="Most days between Tweets" id="most-days" value={mostDuplicates[2] || "N/A"} />
          </>
        ) : ""}
      </div>


      <div>
      </div>
    </div>
  );
};

export default App;
