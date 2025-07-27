import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Loader from "./loader";

export default function Foodapi() {
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [foodata, setfooddata] = useState({ _id: "", imagename: "", videoname: "", audioname: "" })
  // only for single file to be uploaded
  //const [file,setfile]=useState({image:null,video:null,audio:null})
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const fileInputRefimage = useRef("")
  const fileInputRefvideo = useRef("")
  const fileInputRefaudio = useRef("")
  let [errors, setErrors] = useState({})
  let i = 0
  useEffect(() => {
    fetchItems();
  //setTimeout(() => setLoading(false), 3000)
  }, [])

  const fetchItems = async () => {
    await axios.get(import.meta.env.VITE_API_DATA_VIEW).then((res) => {
      //alert(res.data)
      //console.log(res.data)
      return res.data
    }).then((finaldata) => {
      // console.log(finaldata)
      if (finaldata.status)
        setItems(finaldata.data)
    }).catch(error => {
      console.error('Error fetching data:', error); // Handle error
    })
  }
  let foodinsertdata = (e) => {
    e.preventDefault()
    let erroobj = validate()
    if (Object.keys(erroobj).length > 0) {
      alert("form not submited")
    }
    else {
      let formdata = new FormData()
      for (let key in foodata) {
        formdata.append(key, foodata[key])
      }

      if (image) formdata.append('image', image)
      if (video) formdata.append('video', video)
      if (audio) formdata.append('audio', audio)
      if (foodata._id) {
        setLoading(true)
        axios.put(`${import.meta.env.VITE_API_DATA_UPDATE}${foodata._id}`, formdata).then((res) => {
          console.log(res)
          setLoading(false)
          if (res.data.status) {

            toast("data update Successfully!", {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })
            //setMsg("Data saved successfuly")

          }
          else if (res.data.status == 0) {
            toast("data didnot update Successfully!", {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })


          }

          fetchItems()
          setImage(null)
          setAudio(null)
          setVideo(null)
          setfooddata({})
          if (fileInputRefimage.current) {
            fileInputRefimage.current.value = '';
          }
          if (fileInputRefvideo.current) {
            fileInputRefvideo.current.value = '';
          }
          if (fileInputRefaudio.current) {
            fileInputRefaudio.current.value = '';
          }
        }).catch((err) => {
          setLoading(false)
          console.log(err)

          if (err.response) {
            toast(`Error: ${err.response.data.message || err.response.statusText}`, {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })
            // Server responded with a status code out of 2xx
            // setMsg(`Error: ${error.response.data.message || error.response.statusText}`);
          }
          else if (err.request) {
            toast(`no response from serve or network error or backend not stated`, {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })


          }
        }

        )


      }//end of if foodid
      else
         {
        setLoading(true)
        axios.post(import.meta.env.VITE_API_DATA_INSERT, formdata).then((res) => {
          console.log(res)
          setLoading(false)
          if (res.data.status) {
            toast("data save Successfully!", {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })
            

          }
          else if (res.data.status == 0) {
            toast("data not save Successfully!", {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })


          }

          fetchItems()
          setImage(null)
          setAudio(null)
          setVideo(null)
          setfooddata({})
          if (fileInputRefimage.current) {
            fileInputRefimage.current.value = '';
          }
          if (fileInputRefvideo.current) {
            fileInputRefvideo.current.value = '';
          }
          if (fileInputRefaudio.current) {
            fileInputRefaudio.current.value = '';
          }
        }).catch((err) => {
          console.log(err)
          setLoading(false)
          if (err.response) {
            toast(`Error: ${err.response.data.message || err.response.statusText}`, {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })
            // Server responded with a status code out of 2xx
            // setMsg(`Error: ${error.response.data.message || error.response.statusText}`);
          }
          else if (err.request) {
            toast(`no response from serve or network error or backend not stated`, {
              position: "top-right",
              autoClose: 3000, // milliseconds
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,

            })
            

          }
        }

        )

      }//ednd of foodid else
    }//end of validation else
  }
  let onchangehandle = (e) => {
    let { name, value } = e.target
    setfooddata((prev) => ({ ...prev, [name]: value }))

  }
  let onclickfilehandle = (e) => {
    if (e.target.name == "image")
      setImage(e.target.files[0])
    if (e.target.name == "video")
      setVideo(e.target.files[0])
    if (e.target.name == "audio")
      setAudio(e.target.files[0])
    
  }
  let validate = () => {
    let temperror = {}
    if (foodata.imagename == "" || foodata.imagename == null) {
      temperror.imagename = "Please enter the name can not be blank"
    }
    if (foodata.videoname == "" || foodata.videoname == null) {
      temperror.videoname = "Please enter the name can not be blank"
    }
    if (foodata.audioname == "" || foodata.audioname == null) {
      temperror.audioname = "Please enter the name can not be blank"
    }
    if (!image) {
      if (!foodata._id)
        temperror.imagefilename = "please upload any   file"
    }
    else if (!image.type.startsWith('image/'))
      temperror.imagefilename = "please upload only image  file"
    if (!video) {
      if (!foodata._id)
        temperror.videofilename = "please upload any   file"
    }
    else if (!video.type.startsWith('video/'))
      temperror.videofilename = "please upload only video  file"
    if (!audio) {
      if (!foodata._id)
        temperror.audiofilename = "please upload any   file"
    }
    else if (!audio.type.startsWith('audio/'))
      temperror.audiofilename = "please upload only audio file"
    setErrors(temperror)
    return temperror
  }
  let deletefooddata = (e) => {
    //alert('ur in delete and id is=='+e.target.value)
    let id = e.target.value
    //alert(id)
    let confirm1 = confirm("DO YOU WANT DELETE THIS FOOD RECORD")
    if (confirm1) {
      setLoading(true)
      axios.delete(`${import.meta.env.VITE_API_DATA_DELETE}${id}`).then((res) => {
        setLoading(false)
        toast("data deleted Successfully!", {
          position: "top-right",
          autoClose: 3000, // milliseconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,

        })
        console.log(res.data)
        fetchItems()
      }).catch((err) => {
        setLoading(false)
        console.log(err.data)
        toast(err.data, {
          position: "top-right",
          autoClose: 3000, // milliseconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,

        })
      })

    }
  }
  let updatefooddata = (e) => {
    let id = e.target.value
    setLoading(true)
    axios.get(`${import.meta.env.VITE_API_DATA_SINGLEID}${id}`).then((res) => {
      setLoading(false)
      console.log(res.data.data)
      console.log(res.data.data.name)
      setfooddata(res.data.data)
    }).catch(error => {
      setLoading(false)
      console.error('Error fetching data:', error); // Handle error
    })
  }
  return (
    <>
      {loading && <Loader />}
      <h1 className="text-danger text-center text-uppercase bg-info">this is food api</h1>
      {/* form for entering the food data */}
      <form noValidate className="w-50 mx-auto bg-warning p-3 mb-5" onSubmit={foodinsertdata}>
        <div className="mb-3">
          <label className="form-label text-black text-uppercase">Enter The Name of FOOD</label>
          <input name="imagename" type="text" className="form-control" value={foodata.imagename || ""} onChange={onchangehandle} />
          {errors.imagename && <div className="text-danger">{errors.imagename}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label text-black text-uppercase">Upload the Image of Food</label>
          <input name="image" ref={fileInputRefimage} type="file" className="form-control" onChange={onclickfilehandle} />
          {errors.imagefilename && <div className="text-danger">{errors.imagefilename}</div>}
        </div>
        {/* entering the video */}
        <div className="mb-3">
          <label className="form-label text-black text-uppercase">Enter The Name of FOOD video</label>
          <input name="videoname" type="text" className="form-control" value={foodata.videoname || ""} onChange={onchangehandle} />
          {errors.videoname && <div className="text-danger">{errors.videoname}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label text-black text-uppercase">Upload the Video of Food</label>
          <input name="video" ref={fileInputRefvideo} type="file" className="form-control" onChange={onclickfilehandle} />
          {errors.videofilename && <div className="text-danger">{errors.videofilename}</div>}
        </div>
        {/* entriing the audio */}
        <div className="mb-3">
          <label className="form-label text-black text-uppercase">Enter The Name of AUDIO</label>
          <input name="audioname" type="text" className="form-control" value={foodata.audioname || ""} onChange={onchangehandle} />
          {errors.audioname && <div className="text-danger">{errors.audioname}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label text-black text-uppercase">Upload the AUDIO of Food</label>
          <input name="audio" ref={fileInputRefaudio} type="file" multiple className="form-control" onChange={onclickfilehandle} />
          {errors.audiofilename && <div className="text-danger">{errors.audiofilename}</div>}
        </div>
        <button type="submit" className="btn btn-primary">{foodata._id ? "Update Data" : "Add Data"}</button>
      </form>

      {/* end of entering the form */}
      <h1 className=" text-uppercase text-bg-info text-white w-75 mx-auto"> The List of Food ITems</h1>
      <table className="table table-success table-striped table-hover text-center w-75 mx-auto table-responsive" border='1'>
        <thead>
          <tr>
            <th>Srno</th>
            <th>Name of image</th>
            <th>Image</th>
            <th>Name of video</th>
            <th>video</th>
            <th>Name of audio</th>
            <th>Audio</th>
            <th colSpan="2">Action</th>
          </tr>
        </thead>
        <tbody>
          {items ? items.map((item, index) => (
            <tr key={index}>
              <td style={{ verticalAlign: "middle" }} >{++i}</td>
              <td style={{ verticalAlign: "middle" }}>{item.imagename}</td>
              <td>  <img
                src={`${item.imageURL}`}
                alt={item.imagename}
                width="100"
                height="100"
              /></td>
              <td>{item.videoname}</td>
              <td>
                <video width="100" height="100" controls src={`${item.videoURL}`} />
              </td>
              <td>{item.audioname}</td>
              <td>
                <audio controls src={`${item.audioURL}`} />
              </td>
              <td style={{ verticalAlign: "middle" }}><button className="bg bg-warning btn" onClick={updatefooddata} value={item._id}>EDIT</button></td>
              <td style={{ verticalAlign: "middle" }}><button className="bg bg-danger btn" onClick={deletefooddata} value={item._id}>Delete</button></td>
            </tr>


          )) : <h1>no data found</h1>}
        </tbody>
      </table>
    </>
  )
}