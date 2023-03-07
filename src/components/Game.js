import React, { useEffect } from 'react'
import axios from 'axios'

const Game = () => {
    const [result, setResult] = React.useState(0)
    const [nonce, setNonce] = React.useState(0)
    const [hashedServerSeed, setHashedServerSeed] = React.useState('')
    const [previousServerSeed, setPreviousServerSeed] = React.useState('')
    const [clientSeed, setClientSeed] = React.useState('')

    const [lessThan50, setLessThan50] = React.useState(false)
    const [moreThan50, setMoreThan50] = React.useState(false)
    const [won, setWon] = React.useState(false)
    const [lost, setLost] = React.useState(false)
    const [infiniteNum, setInfiniteNum] = React.useState(0)
    const getRandomNumber = () => {
        if(!lessThan50 && !moreThan50) {
            alert('Please select either <50 or >50')
            return;
        }
        setResult(0);
        setWon(false);
        setLost(false);

        axios.post('https://dev-beapi-games-rgs.sportsit-tech.net/provablyfair/api/randomNumber/getRandom', { clientSeed: clientSeed })
        .then((res) => {
            console.log(res)
            // set the nonce, hashedServerSeed, previousServerSeed, and clientSeed
            setNonce(res.data.random.nonce);
            setHashedServerSeed(res.data.random.hashedServerSeed);
            setPreviousServerSeed(res.data.random.previousServerSeed);
            setClientSeed(res.data.random.clientSeed);
            const _result = ((res.data.random.finalResult[0])/100).toFixed(1);
            // wait for a second before setting the result
            setTimeout(() => { 
                setResult(_result);
                console.log('result', _result)
                console.log('lessThan50', lessThan50)
                console.log('moreThan50', moreThan50)
                console.log('won', won)
                console.log('lost', lost)
                console.log(((_result < 50) && lessThan50))
                if (((_result < 50) && lessThan50) || ((_result >= 50) && moreThan50)) {
                    setWon(true);
                }
                else {
                    setLost(true);
                }
            }, 1000);
            
        })
        generateInfiniteNum();
    }
    const changeClientSeed = () => {
        console.log('change client seed')
        // generate a random client seed hex string
        const clientSeed = Math.random().toString(16).slice(2)
        // use axios to make a post request to the server 'https://dev-beapi-games-rgs.sportsit-tech.net/provablyfair/api/randomNumber/updateClientSeed'
        axios.post('https://dev-beapi-games-rgs.sportsit-tech.net/provablyfair/api/randomNumber/updateClientSeed', { newClientSeed: clientSeed })
        .then((res) => {
            console.log(res)
            // set the nonce, hashedServerSeed, previousServerSeed, and clientSeed
            setNonce(res.data.newServerSeed.nonce)
            setHashedServerSeed(res.data.newServerSeed.hashedServerSeed)
            setPreviousServerSeed(res.data.newServerSeed.previousServerSeed)
            setClientSeed(res.data.newServerSeed.clientSeed)
        })
    }
    const generateInfiniteNum = () => {
        // generate 100 random numbers array
        const randomNums = [];
        for(let i = 0; i < 100000; i++) {
            randomNums.push((Math.random()*100).toFixed(2))
        }
        let index = 0;
        // increment the infiniteNum by 1 every `1 millisecond`
        setInterval(() => { 
            setInfiniteNum(randomNums[index]);
            index ++;
        }, 1);
    }

    const verifyResult = () => {
        console.log('verify result')
    }

    const selectLess50 = () => {
        setLessThan50(true);
        setMoreThan50(false);
    }
    const selectMore50 = () => {
        setLessThan50(false);
        setMoreThan50(true);
    }

    const colorfulText = () => {
        if(won) {
            return 'text-[150px] font-bold text-green-600 mt-[10%]'
        }
        else{
            return 'text-[150px] font-bold text-red-600 mt-[10%]'
        }
    }
    const normalText = 'text-8xl font-bold text-gray-600 mt-[10%]'

    useEffect(() => {
        changeClientSeed();
    }, [])

  return (
      <div className={(lost || won)? (lost? 'flex flex-col h-screen items-center justify-between bg-gradient-to-b from-white to bg-red-200' : 'flex flex-col h-screen items-center justify-between bg-gradient-to-b from-white to bg-green-200'): 'flex flex-col h-screen items-center justify-between bg-gradient-to-b from-yellow-100 to bg-gray-200'}>
        {/* div stays in the top quater */}
        <div className="h-2/3 w-2/3 bg-gradient-to-b from-white to bg-gray-300 flex flex-col items-center justify-between rounded overflow-hidden">
            <h1 className={(lost || won)?colorfulText(): 'text-8xl font-bold text-gray-600 mt-[10%]'} > { result ? result: infiniteNum } </h1>
            <div className='mb-10'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold py-3 px-6 rounded-md' onClick={getRandomNumber}> 
                    PLAY
                </button>
            </div>
        </div>
        <div className='w-2/3 flex justify-evenly items-center mt-2 mb-4'>
            <span className={lessThan50?'text-5xl text-white border-4 border-orange-300 font-bold py-2 px-4 bg-orange-500 rounded-lg':'text-5xl hover:border-4 text-orange-500  border-orange-300 cursor-pointer font-bold py-2 px-4 bg-gray-100 rounded-lg'} 
            onClick={selectLess50}> {'<50'} </span>
            <span className={moreThan50?'text-5xl text-white border-4 border-orange-300 font-bold py-2 px-4 bg-orange-500 rounded-lg':'text-5xl hover:border-4 text-orange-500  border-orange-300 cursor-pointer font-bold py-2 px-4 bg-gray-100 rounded-lg'} 
            onClick={selectMore50}> {'>50'} </span>
        </div>
        

        <div class="h-1/4 w-2/3 bg-gray-200 flex flex-col flex-wrap justify-between items-center rounded">
            {/* verify button that stays next the edge*/}
            <div className='w-2/3 flex justify-center'>
                <a href='https://www.provablyfair.me/casino/stake-verifier/' target="_blank"><span className='text-xl text-blue-400 font-semibold mr-0 cursor-pointer hover:text-blue-700 underline' onClick={verifyResult}>Verify Result</span></a>
            </div>
            <div className='flex flex-col flex-wrap'>
                <a><span className='text-2xl font-semibold text-black ml-16'>nonce: </span> <span className='text-2xl font-semibold text-gray-500'>{nonce}</span>  </a>
                <a><span className='text-2xl font-semibold text-black'>clientSeed: </span> <span className='text-2xl font-semibold text-gray-500'>{clientSeed}</span> 
                <span className='text-xl bg-blue-400 font-semibold rounded-md text-white ml-3 p-1 hover:bg-blue-600 cursor-pointer' onClick={changeClientSeed}>change</span> </a>
                <a><span className='text-2xl font-semibold text-black'>hashedServerSeed: </span> <span className='text-2xl font-semibold text-gray-500'>{hashedServerSeed}</span>  </a>
                <a><span className='text-2xl font-semibold text-black'>previousServerSeed: </span> <span className='text-2xl font-semibold text-gray-500'>{previousServerSeed}</span>  </a>
            </div>
        </div>
      </div>
  )
}

export default Game
