'use strict';
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    body: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Post.belongsTo(models.User, {foreignKey: 'userId'});
        Post.hasMany(models.Like, {foreignKey: 'postId'});
        // associations can be defined here
      }
    }
  });
  return Post;
};
