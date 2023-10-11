import {useState} from 'react'
import { useToast } from '@chakra-ui/react'

function profileImageChange() {
    const [imgUrl , setImgUrl] = useState(null)
    const toast = useToast()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if(file && file.type.substr(0,5) === 'image'){
            const reader = new FileReader()

            reader.onloadend = () => {
                setImgUrl(reader.result)
            }
            reader.readAsDataURL(file)
        }else{
            setImgUrl(null)
            toast({
                title: "Invalid Image",
                description: "Please select a valid image",
                status: "error",
                duration: 3000,
                isClosable: true,
              })
        }

    }
  return {handleImageChange , imgUrl , setImgUrl}
}

export default profileImageChange