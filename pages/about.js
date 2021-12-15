export default function About(){
    return (<div>
        {new Array(200).fill('about').map((_, index) => {return (<div key={index}>{_}</div>)})}
    </div>)
}