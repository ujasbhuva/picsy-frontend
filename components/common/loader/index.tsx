import { useEffect, useRef, useState } from 'react';
import LoadingBar from 'react-top-loading-bar'

const Loader = ({ loading }: any) => {
    const [progress, setProgress] = useState(0)

    const loadIncreaser = () => {
        if (progress < 90) {
            setProgress(preval => { return preval + 5 })
        }
        setTimeout(loadIncreaser, 1000)
    }

    useEffect(() => {
        if (loading === false) {
            setProgress(0)
        }
        else (
            loadIncreaser()
        )
    }, [loading])

    return (
        <LoadingBar
            height={3}
            color='#5F85DB'
            progress={progress}
            shadow={true}
            onLoaderFinished={() => setProgress(0)}
        />
    )
}

export default Loader;