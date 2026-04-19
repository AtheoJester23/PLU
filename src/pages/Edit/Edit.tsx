import { Target, Upload, X } from "lucide-react"
import { nanoid } from "nanoid";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import supabase from "../../config/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

type possibleErrs = {
  name: boolean,
  price: boolean,
  bio: boolean,
  pic: boolean
}

type productDeets = {
  created_at: string,
  description: string,
  id: string,
  name: string,
  picture: string,
  price: number,
  store_id: string,
  updated_at?: string
}

const Edit = () => {
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState<productDeets | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePrev, setImagePrev] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    bio: false,
    pic: false
  })
  const navigate = useNavigate();
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
        setImageFile(file);
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

  const handleUpload = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("productName") as string;
    const price = Number(formData.get('productPrice')) as number;
    const description = formData.get('description') as string;
    
    let errs = {...errors};
    
    if(!imageFile){
      errs.pic = true;
    }

    if(!name || name.replace(/[ ]/g, "") == ""){
      errs.name = true;
    }
    
    if(!price || price <= 0){
      errs.price = true;
    }

    if(!imagePrev){
      errs.pic = true;
    }

    // if(Object.values(errs).includes(true)){
    //   setErrors(errs);
    //   errs = {...errors};
    //   return;
    // }

    try {
      const {data, error} = await supabase.storage.from('productsPic').upload(`public/${imageName}`, imageFile)
    
      if(error) throw error;

      // console.log("Image uploaded successfully: ", data.path)
    
      const {data: urlData} = await supabase.storage.from('productsPic').getPublicUrl(data.path);

      console.log(urlData);

      const {data: storeSesh} = await supabase.auth.getSession();

      console.log(storeSesh.session?.user.id);

      const saveFile = {
        store_id: storeSesh.session?.user.id,
        name,
        price,
        description,
        picture: urlData.publicUrl,
      }

      const {data: productsData, error: productsError} = await supabase.from('products').insert(saveFile);

      if(productsError) throw productsError;

      navigate("/home");
    } catch (error) {
      console.error((error as Error).message)
    }

  }

  useEffect(() => {
    const getProduct = async () => {
        try {
            const {data, error} = await supabase.from('products').select('*').eq("id", id).single();

            if(error) throw error;

            setProductDetails(data);
        } catch (error) {
            console.error((error as Error).message)
        }
    }

    getProduct();
  },[]) 

  return (
    <main className="bg-main  p-10 pt-20">
      <form className="simpleForms h-[100%] shadow-lg" onSubmit={(e) => handleUpload(e)}>
        <h1 className="text-4xl font-bold">Edit Product</h1>
        <div>
            <input
                className="w-full"
                type="text"
                value={productDetails?.name || ""}
                onChange={(e) =>
                    setProductDetails((prev) => {
                        if (!prev) return prev; // or return a default object

                        return {
                        ...prev,
                        name: e.target.value,
                        };
                    })
                }
                name="productName"
                placeholder="Product Name"
                autoComplete="off"
            />
        </div>

        <div>
          <input 
            className="w-full" 
            type="number" 
            value={productDetails?.price}
            onChange={(e) =>
                setProductDetails((prev) => {
                    if (!prev) return prev; // or return a default object

                    return {
                        ...prev,
                        price: Number(e.target.value),
                    };
                })
            }
            name="productPrice" 
            placeholder="Product Price" 
            autoComplete="off"
          />
        </div>

        <div className="red-5005">
          <textarea 
            className="w-full" 
            name="description"
            value={productDetails?.description}
            onChange={(e) => {
                setProductDetails((prev) => {
                    if(!prev) return prev;

                    return {
                        ...prev,
                        description: e.target.value
                    }
                })
            }} 
            placeholder="Description" 
            rows={12}
          />
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

export default Edit
