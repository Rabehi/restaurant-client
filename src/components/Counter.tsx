import { useState } from 'react'

export function Counter() {
    const [counter, setCounter] = useState(0)

    return (
        <>
            <button id="increment" type="button" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                onClick={() => setCounter(counter => counter + 1)}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14" />
                </svg>
            </button>
            <a className="ml-3 mr-3">{counter}</a>
            <button id="decrement" type="button" className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-800"
                onClick={() => {
                    if (counter > 0) {
                        setCounter(counter => counter - 1);
                    }
                }}>
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5" />
                </svg>
            </button>
        </>
    )
}
