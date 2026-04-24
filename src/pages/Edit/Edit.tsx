import { Target, TriangleAlert, Upload, X } from "lucide-react"
import { nanoid } from "nanoid";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import supabase from "../../config/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from 'framer-motion'

type possibleErrs = {
  name: boolean,
  price: boolean,
  bio: boolean,
  category: boolean,
  pic: boolean
}

type productDeets = {
  created_at?: string,
  description?: string,
  id?: string,
  name?: string,
  picture?: string,
  picture_name?: string,
  price?: number,
  store_id?: string,
  category?: string,
  updated_at?: string
}

const Edit = () => {
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState<productDeets | null>(null);

    const [confirmDel, setConfirmDel] = useState(false)

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePrev, setImagePrev] = useState<string | null>(null);
    const [imageName, setImageName] = useState<string | null>(null);
    const [errors, setErrors] = useState<possibleErrs>({
        name: false,
        price: false,
        bio: false,
        category: false,
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

  const handleUpdate = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("productName") as string;
    const price = Number(formData.get('productPrice')) as number;
    const category = formData.get("category") as string;
    const description = formData.get('description') as string;
    
    let errs = {...errors};
    

    if(!name || name.replace(/[ ]/g, "") == ""){
      errs.name = true;
    }
    
    if (isNaN(price) || price < 0){
      errs.price = true;
    }

    if(!category || category.replace(/[ ]/g, "") == ""){
      errs.category = true;
    }

    if(!imagePrev){
      console.log("This", imagePrev);
      errs.pic = true;
    }

    if(Object.values(errs).includes(true)){
      setErrors(errs);
      errs = {...errors};
      console.log("There's an error", errors);
      return;
    }

    try {
      const saveFile: productDeets = {
        name,
        price,
        description,
      }

      if(imageFile){
        // 1. Upload first
        const { data: uplProd, error: uplProdErr } =
          await supabase.storage.from("productsPic")
            .upload(`public/${imageName}`, imageFile);

        if (uplProdErr) throw uplProdErr;

        // 2. Get URL
        const { data: urlData } =
          supabase.storage.from('productsPic')
            .getPublicUrl(uplProd.path);

        // 3. Update DB
        saveFile.picture = urlData.publicUrl;
        saveFile.picture_name = imageName ?? "";

        // 4. THEN delete old file (optional cleanup)
        await supabase.storage.from("productsPic")
        .remove([`public/${productDetails?.picture_name}`]);
      }

      const {data: storeSesh} = await supabase.auth.getSession();

      console.log(storeSesh.session?.user.id);

      const {error: productsError} = await supabase.from('products').update(saveFile).eq("id", id);

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
            setImagePrev(data.picture);
            setImageName(data.picture_name);

            console.log(data);
          } catch (error) {
            console.error((error as Error).message)
        }
    }

    getProduct();
  },[]) 

  const handleDelete = async () => {
    try {
        const {data, error} = await supabase.from('products').delete().eq("id", productDetails?.id);

        if(error) throw error;

        const {error: storageDataErr} = await supabase.storage.from("productsPic").remove([`public/${productDetails?.picture_name}`]);

        if(storageDataErr) throw storageDataErr;

        console.log(data);

        navigate("/");
    } catch (error) {
        console.error((error as Error).message)
    }
  }

  return (
    <main className="bg-main  p-10 pt-20">
      <form className="simpleForms h-[100%] shadow-lg" onSubmit={(e) => handleUpdate(e)}>
        <h1 className="text-4xl font-bold">Edit Product</h1>
        <div>
            <input
                className="w-full"
                type="text"
                value={productDetails?.name || ""}
                onChange={(e) =>{
                  setErrors((prev) => ({...prev, name: false}))  
                  setProductDetails((prev) => {
                      if (!prev) return prev; // or return a default object

                      return {
                      ...prev,
                      name: e.target.value,
                      };
                  })
                }
                }
                name="productName"
                placeholder="Product Name"
                autoComplete="off"
            />
            {errors.name && <small className="text-red-500">Product Name is required*</small>}
        </div>

        <div>
          <input 
            className="w-full" 
            type="number" 
            value={productDetails?.price}
            onChange={(e) =>{
                setErrors(prev => ({...prev, price: false}))
                setProductDetails((prev) => {
                  if (!prev) return prev; // or return a default object
                  
                  return {
                        ...prev,
                        price: Number(e.target.value),
                    };
                })
            }
            }
            name="productPrice" 
            placeholder="Product Price" 
            autoComplete="off"
          />
          {errors.price && <small className="text-red-500">Product Price is required*</small>}
        </div>

        <div>
          <input 
            className="w-full" 
            type="text" 
            value={productDetails?.category}
            onChange={(e) =>
                setProductDetails((prev) => {
                    if (!prev) return prev; // or return a default object

                    return {
                        ...prev,
                        category: e.target.value,
                    };
                })
            }
            name="category" 
            placeholder="Category" 
            autoComplete="off"
          />
          {errors.category && <small className="text-red-500">Category is required*</small>}
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
          <div>
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
            <small className="text-red-500">Image is requried*</small>
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

        <div className="w-full flex gap-2">
            <button type="button" onClick={() => setConfirmDel(true)} className="flex-1 cursor-pointer active:cursor-default bg-red-500 font-bold py-3 rounded text-[var(--textColorr)]">
                Delete
            </button>
            <button className="flex-1 cursor-pointer active:cursor-default bg-green-500 font-bold py-3 rounded text-[var(--textColorr)]">
                Submit
            </button>
        </div>
      </form>
      <Dialog 
        open={confirmDel} 
        onClose={setConfirmDel} 
        className="relative z-50"
      >
        <motion.div className="fixed inset-0 bg-black/60" 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        />

        <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>

            <DialogPanel className="mx-auto max-w-sm rounded bg-white p-5 max-sm:w-[90%] sm:w-[50%]">
                <div className='flex justify-center flex-col items-center gap-3'>
                    <TriangleAlert size={100} className='text-red-500'/>
                    <div className='text-center'>
                        <DialogTitle className="text-2xl font-bold">Are you sure?</DialogTitle>
                        <p className="text-gray-500">Warning: This action cannot be undone.</p>
                    </div>
                    <div className='flex gap-3'>
                        <button 
                            type="button"
                            className='px-5 py-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' 
                            onClick={() => handleDelete()}>
                                Yes
                        </button>
                        <button className='px-5 py-2 bg-gray-500 text-white rounded-full cursor-pointer hover:bg-gray-600 duration-200 -translate-y-0.25 hover:translate-none shadow hover:shadow-none' onClick={() => setConfirmDel(false)}>Cancel</button>
                    </div>
                </div>
            </DialogPanel>
        </div>

      </Dialog>
    </main>
  )
}

export default Edit
