import React, { useEffect, useState } from 'react'
import { imgdb } from './firebase'
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { v4 } from "uuid"
const Uploadimg = async() => {
    const [img,setimg] = useState("")
    const [imgurl,setimgurl] = useState("")

    const upload = async()=>{

            if (img != null) {
                const imgref = ref(imgdb, `files/${v4()}`)
                 await uploadBytes(imgref, img).then(async(value) => {
                    
                    await getDownloadURL(value.ref).then(url => {
                        setimgurl(url)
                        // console.log(url);
                       
                    })
                    
                })
            }
        
    }


    // return(
    //     <div>
    //         <input type="file" name="" onChange={e=>setimg(e.target.files[0])} id="" />
    //         <button onClick={()=>upload()}></button>
    //         <img src={imgurl} alt="" />
    //     </div>
    // )

}

export default Uploadimg
