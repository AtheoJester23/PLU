import { Upload, X } from "lucide-react"
import { useRef, useState } from "react";

type possibleErrs = {
  name: boolean,
  price: boolean,
  bio: boolean,
  pic: boolean
}

const Create = () => {
  const [imagePrev, setImagePrev] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    bio: false,
    pic: false
  })
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickPic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];

    if(!file) return;
    
    if(!file.type.startsWith('image/')){
      alert("Please select an image file!");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const result = reader.result;
      if(typeof result === 'string'){
        setImagePrev(result);
        setImageName(file.name);
        setErrors((prev) => ({...prev, pic: false}))
      }
    }
  }

  const handleRemovePic = () => {
      setImageName(null);
      setImagePrev(null);

      if(fileInputRef.current){
          fileInputRef.current.value = "";
      }
  }

  return (
    <main className="bg-main h-full simpleMains">
      <form className="simpleForms">
        <h1 className="text-4xl font-bold">Create Product</h1>
        <div>
          <input className="w-full" type="text" name="productName" placeholder="Product Name" autoComplete="off"/>
        </div>

        <div>
          <input className="w-full" type="number" name="productName" placeholder="Product Price" autoComplete="off"/>
        </div>

        <div className="red-5005">
          <textarea className="w-full" placeholder="Description"/>
        </div>

        {!imagePrev ? (
          <div className="flex flex-col justify-center w-full items-center border border-dashed border-2 rounded border-nav">
            <label 
              htmlFor="pic"
              className="bg-white w-full h-full p-5 justify-center flex flex-col items-center cursor-pointer"
            >
              <Upload className="text-nav"/>
              <span className="text-nav font-bold">Choose Picture</span>
              <input 
                ref={fileInputRef}
                id="pic" 
                type="file"
                accept="image/*" 
                className="hidden"
                onChange={(e) => handlePickPic(e)}
              />
            </label>
          </div>
        ):(
          <div className={`flex flex-col p-2 w-full justify-center items-center border border-dashed border-2 relative cursor-default`}>
            <div className='max-sm:h-[150px] max-sm:w-[300px] h-[200px] w-[400px] flex gap-2'> 
                <img src={imagePrev} alt="Preview" className='w-full h-full object-contain'/>
            </div>
            <div className='flex w-full items-center justify-center'>
                <p className='p-2 truncate'>{imageName}</p>
            </div>
            <button onClick={() => handleRemovePic()} className='absolute top-2 right-2 hover:translate-y-0.25 cursor-pointer duration-200'>
                <X/>
            </button>
          </div>
        )}

        <button className="cursor-pointer active:cursor-default bg-btn font-bold py-3 rounded text-[var(--textColorr)]">
          Submit
        </button>
        
      </form>
    </main>
  )
}

export default Create
