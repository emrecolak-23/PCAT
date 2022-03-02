const Photo = require('../models/Photo');
const fs = require('fs')

exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find().sort('-dateCreated');
  res.render('index', {
    photos,
  });
}

exports.updatePhoto = async (req,res) =>{

  const photo = await Photo.findOne({_id:req.params.id});

  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`)

}

exports.createPhoto = async (req, res) => {

  const uploadedDir = 'public/uploads';

  if (!fs.existsSync(uploadedDir)) {
    fs.mkdirSync(uploadedDir);
  }

  let uploadedImage = req.files.image;
  let uploadedPath = __dirname + '/../public/uploads/' + uploadedImage.name;
  uploadedImage.mv(uploadedPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
  });

  res.redirect('/');

  //await Photo.create(req.body);
  // res.redirect('/');
}

exports.getPhotoById = async (req,res) => {
  const photo = await Photo.findOne({_id:req.params.id})
  
  res.render('photo',{
    photo
  })

}

exports.deletePhoto = async (req,res)=>{

  const photo = await Photo.findOne({_id:req.params.id})

  let deletedImage = __dirname + '/../public' + photo.image;

  fs.unlinkSync(deletedImage);

  await Photo.findByIdAndRemove(req.params.id)

  res.redirect('/');
}
