'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    like: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Like.belongsTo(models.User, {foreignKey: 'userId'});
        Like.belongsTo(models.Post, {foreignKey: 'postId'});
        // associations can be defined here
      }
    }
  });
  return Like;
};
