import React, { useState } from 'react'

import { useNetwork, useContractWrite, useWaitForTransaction, useAccount, useSendTransaction } from 'wagmi'

import { ethers } from 'ethers';


const config = [
    {
        'id': 'steth - leverage 1x',
        'describe': 'low risk -- leverage 1x',
        'arbPerp': '0x84ca709D238F62c7beE66E87DBd8Ff3563d5778a',
        'arbYieldPool': '0x8219bbf3BE643bd5305EB3be122bf480aa48646c',
        'ethLsdYieldPool': '0x9dc904ED02CAC158b738420d1347086F02f7B0fA',
        'apy': '5.2%'
    },
    {
        'id': 'steth - leverage 2x',
        'describe': 'medium risk -- leverage 2x',
        'arbPerp': '0x84ca709D238F62c7beE66E87DBd8Ff3563d5778a',
        'arbYieldPool': '0x8219bbf3BE643bd5305EB3be122bf480aa48646c',
        'ethLsdYieldPool': '0x9dc904ED02CAC158b738420d1347086F02f7B0fA',
        'apy': '6.7%'
    },
    {
        'id': 'steth - leverage 3x',
        'describe': 'high risk -- leverage 3x',
        'arbPerp': '0x84ca709D238F62c7beE66E87DBd8Ff3563d5778a',
        'arbYieldPool': '0x8219bbf3BE643bd5305EB3be122bf480aa48646c',
        'ethLsdYieldPool': '0x9dc904ED02CAC158b738420d1347086F02f7B0fA',
        'apy': '7.6%'
    }
]


const StatisticsCard = ({ title, value, infoText }) => {
    return (
        <div className="flex items-center flex-col bg-purple-800 px-24 py-10 rounded-lg shadow-md">
            <div className="text-3xl font-bold">{value}</div>
            <div className="flex items-center justify-between mt-2">
                <span>{title}</span>
            </div>
        </div>
    );
};

const PoolCard = ({ item }) => {

    const [depositInputValue, setDepositInputValue] = useState('');
    const [withdrawInputValue, setWithdrawInputValue] = useState('');

    const [depositError, setDepositError] = useState('');
    const [withdrawError, setWithdrawError] = useState('');




    const handleDepositInputChange = (e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setDepositInputValue(e.target.value);
            setDepositError('')
        } else {
            setDepositError('invalid number')
        }
    };

    const handleWithdrawInputChange = (e) => {
        if (/^\d*\.?\d*$/.test(e.target.value)) {
            setWithdrawInputValue(e.target.value);
            setWithdrawError('')
        } else {
            setWithdrawError('invalid number')
        }
    };



    /////////////////////////////////////////////////

    const { write: approve } = useContractWrite({
        address: '0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63',
        abi: [{
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'approve',
        args: [item.arbYieldPool, !depositInputValue ? '0' : ethers.utils.parseUnits(depositInputValue.toString(), 6)],
    })

    const { write: deposit } = useContractWrite({
        address: item.arbYieldPool,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "depositUsdc",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'depositUsdc',
        args: [!depositInputValue ? null : ethers.utils.parseUnits(depositInputValue.toString(), 6)],
        onSettled(data, error) {
            console.log(data, error)
        }
    })


    const { write: requestUsdcWithdrawal } = useContractWrite({
        address: item.arbYieldPool,
        abi: [{
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "requestUsdcWithdrawal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'requestUsdcWithdrawal',
        args: [!withdrawInputValue ? null : ethers.utils.parseUnits(withdrawInputValue.toString(), 6)],
        onSettled(data, error) {
            console.log(data, error)
        }
    })

    const { write: finishWithdraw } = useContractWrite({
        address: item.arbYieldPool,
        abi: [{
            "inputs": [],
            "name": "withdrawUsdc",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }],
        functionName: 'withdrawUsdc',
        args: [],
        onSettled(data, error) {
            console.log(data, error)
        }
    })


    return (
        <div className="flex flex-row justify-between bg-purple-900 shadow-md p-6 rounded-lg mb-4">
            <div className="flex flex-1 text-2xl justify-start space-x-6">
                <div>
                    {item.id}
                </div>
            </div>

            <div className="flex flex-1 text-2xl justify-start space-x-6">
                <div>
                    {item.apy}
                </div>
            </div>

            <div className='flex flex-1 justify-end space-x-3 '>
                <button className='btn btn-primary' onClick={() => document.getElementById(`deposit_token_${item.id}`).showModal()}>
                    deposit
                </button>

                <dialog id={`deposit_token_${item.id}`} className="modal">
                    <div className="modal-box bg-purple-800">
                        <h3 className="font-bold text-lg">Deposit Token:</h3>

                        <div className="flex space-x-4 items-center text-red-600">
                            <input
                                type="text"
                                className="border p-2 rounded-md"
                                placeholder="Enter Amount"
                                value={depositInputValue}
                                onChange={handleDepositInputChange}
                            />
                            <button className="btn btn-primary" onClick={() => approve?.()}>approve</button>
                            <button className="btn btn-primary" onClick={() => deposit?.()}>Deposit</button>
                        </div>
                        <div className='text-red-600'>
                            {depositError}
                        </div>
                        <div className='flex flex-col mt-10'>
                            <a href={`https://goerli.arbiscan.io/address/${item.arbYieldPool}`} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-purple-100 underline">
                                {`Arb Yield Pool ↗`}
                            </a>
                            <a href={`https:/goerli.etherscan.io/address/${item.ethLsdYieldPool}`} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-purple-100 underline">
                                {`Goerli LSD Yield Pool ↗`}
                            </a>
                        </div>

                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>


                {/* /////////////////////////////////////////// */}


                <button className='btn btn-primary' onClick={() => document.getElementById(`withdraw_token_${item.id}`).showModal()}>
                    request withdraw
                </button>

                <dialog id={`withdraw_token_${item.id}`} className="modal">
                    <div className="modal-box bg-purple-800">
                        <h3 className="font-bold text-lg">Withdraw Token:</h3>

                        <div className="flex space-x-4 items-center text-red-600">
                            <input
                                type="text"
                                className="border p-2 rounded-md"
                                placeholder="Enter Amount"
                                value={withdrawInputValue}
                                onChange={handleWithdrawInputChange}
                            />
                            <button className="btn btn-primary" onClick={() => requestUsdcWithdrawal?.()}>request Withdraw</button>
                        </div>
                        <div className='text-red-600'>
                            {withdrawError}
                        </div>
                        <div className='flex flex-col mt-10'>
                            <a href={`https://goerli.arbiscan.io/address/${item.arbYieldPool}`} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-purple-100 underline">
                                {`Arb Yield Pool ↗`}
                            </a>
                            <a href={`https:/goerli.etherscan.io/address/${item.ethLsdYieldPool}`} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-purple-100 underline">
                                {`Goerli LSD Yield Pool ↗`}
                            </a>
                        </div>

                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>



                {/* /////////////////////////////////////////// */}


                <button className='btn btn-primary' onClick={() => document.getElementById(`finish_withdraw_token_${item.id}`).showModal()}>
                    finish withdraw
                </button>

                <dialog id={`finish_withdraw_token_${item.id}`} className="modal">
                    <div className="flex flex-col items-center modal-box bg-purple-800">

                        <div className="flex space-x-4 items-center text-red-600">
                            <button className="btn btn-primary" onClick={() => finishWithdraw?.()}>finish Withdraw</button>
                        </div>
                        <div className='flex flex-col mt-10'>
                            <a href={`https://goerli.arbiscan.io/address/${item.arbYieldPool}`} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:text-purple-100 underline">
                                {`Arb Yield Pool ↗`}
                            </a>
                        </div>

                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                    </div>

                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>
        </div>
    )
}

const Yield = () => {


    const stats = [
        { title: 'LSD Interest Rate', value: '10.34%' },
        { title: 'Total Value Locked', value: '4332.55 USDC' },
        { title: 'PERP Interest Rate', value: '1.25%' }
    ];

    return (
        <div className="bg-purple-900 text-white min-h-screen">
            <div className="flex flex-col items-center container mx-auto py-4">
                <header className="mb-10">
                    <div className="flex flex-col items-center justify-center mt-10">
                        <h1 className="text-3xl font-bold">YYCZ LSD&PERP Yield Protocol</h1>
                        <h2 className="text-lg">Power by CCTP</h2>
                    </div>
                </header>

                <div className="p-6 flex justify-between gap-24">
                    {stats.map((stat, index) => (
                        <StatisticsCard key={index} title={stat.title} value={stat.value} infoText={stat.infoText} />
                    ))}
                </div>

                <div className='flex flex-col items-center bg-purple-800 p-6 rounded-lg w-5/6'>
                    <div className="w-full mb-4 px-4">
                        <div className="flex justify-between text-white text-xl">
                            <div className="header-title">Strategy Pool</div>
                            <div className="header-title">APY</div>
                            <div className="header-title">Operate</div>
                            <div className="header-title text-purple-800">xxxxxxxxxxx</div>
                        </div>
                    </div>
                    <div className="mt-2 w-full">
                        {config.map(item => <PoolCard key={item.id} item={item} />)}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Yield;