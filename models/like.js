'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    like: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        Like.belongsTo(models.User, {foreignKey: 'userId'});
        Like.belongsTo(models.Like, {foreignKey: 'userId'});
        // associations can be defined here
      }
    }
  });
  return Like;
};
