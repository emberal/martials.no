/* @refresh reload */
import type { FetchResultsProps, WebWorkerProps } from '../types/interfaces';

onmessage = async (e: MessageEvent<WebWorkerProps>) => {
    console.log("Worker: Message received from main script")
    const {
        expression,
        simplifyEnabled,
        hideValue,
        sortValue,
        hideIntermediates
    } = e.data;

    const result: FetchResultsProps = {
        fetchResult: null,
        error: null,
    };

    await fetch(`https://api.martials.no/simplify-truths/do/simplify/table?exp=${ encodeURIComponent(expression) }&
simplify=${ simplifyEnabled }&hide=${ hideValue }&sort=${ sortValue }&caseSensitive=false&
hideIntermediate=${ hideIntermediates }`)
        .then(res => res.json())
        .then(res => result.fetchResult = res)
        .catch(err => result.error = err.toString());

    postMessage(result);
};
