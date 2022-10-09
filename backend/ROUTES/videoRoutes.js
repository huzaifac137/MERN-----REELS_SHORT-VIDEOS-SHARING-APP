const express = require("express");
const postVideos =require("../CONTROLLERS/videoControllers").postVideos;
const getVideos =require("../CONTROLLERS/videoControllers").getVideos;
const videoUploader = require("../videoUploader/multer");
const getVideosByUser = require("../CONTROLLERS/videoControllers").getVideosByUser;
const deleteVideo = require("../CONTROLLERS/videoControllers").deleteVideo;

const router = express.Router();

router.get("/" , getVideos);
router.get("/:username" , getVideosByUser );
router.post("/upload" , videoUploader.single("file") , postVideos);
router.delete("/:id/delete" , deleteVideo );

module.exports = router;