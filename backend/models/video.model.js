
module.exports = (sequelize , Sequelize)=>{

    const video = sequelize.define("video" , {
        title : {
            type : Sequelize.STRING
        } ,
       file : {
            type : Sequelize.STRING
        } , 
       creatorUsername: {
            type : Sequelize.STRING
        } ,
        likes : {
            type : Sequelize.JSON
        }
    });

    return video;
}