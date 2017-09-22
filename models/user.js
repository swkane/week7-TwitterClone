'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    displayName: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // User.hasMany(models.Like, {foreignKey: 'userId'});
        User.hasMany(models.Post, {foreignKey: 'userId'});      }
    }
  });
  return User;
};
