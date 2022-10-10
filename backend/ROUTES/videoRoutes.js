const express = require("express");
const postVideos =require("../CONTROLLERS/videoControllers").postVideos;
const getVideos =require("../CONTROLLERS/videoControllers").getVideos;
const videoUploader = require("../videoUploader/multer");
const getVideosByUser = require("../CONTROLLERS/videoControllers").getVideosByUser;
const deleteVideo = require("../CONTROLLERS/videoControllers").deleteVideo;
const onLike = require("../CONTROLLERS/videoControllers").onLike;


const auth = require("../Auth");

const router = express.Router();

router.get("/" , getVideos);
router.get("/:username" , getVideosByUser );
router.post("/upload" , auth ,  videoUploader.single("file") , postVideos);
router.delete("/:id/delete" , auth , deleteVideo );
router.post("/:id/likes" , auth , onLike );

module.exports = router;