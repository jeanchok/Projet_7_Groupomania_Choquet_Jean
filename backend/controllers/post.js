const {Post,User,Comment} = require('../models/index');

const fs = require('fs');

exports.createPost = (req, res, next) => {
    console.log(req.body);
    const postObject = req.body.post;
    delete postObject._id;
    const post = new Post({
      ...postObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      /*,likes : 0,
      dislikes : 0,
      usersLiked: [' '],
      usersDisliked: [' ']*/
    });
    post.save()
    .then(
      () => {
        res.status(201).json({
          message: 'Post enregistrée !'
        });
      })
    .catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
};

exports.getAllPosts = (req, res) => {
  Post.findAll({include : User})
  .then(
    (posts) => {
      res.status(200).json(posts);
    })
  .catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({include : User,Comment},{_id: req.params.id})
  .then(
    (post) => {
      res.status(200).json(post);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then(
    (post) => {
      if (!post) {
        res.status(404).json({
          error: new Error('No such Thing!')
        });
      }
      if (post.userId !== req.auth.userId) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
      const postObject = req.file ?
        {
          ...req.body.post,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
      if(req.file){
        const filename = post.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, ()=> { console.log("Image deleted !")})
      };
      Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
      .then(() => {
          res.status(201).json({
            message: 'Post modified !'
          });
        }
      )
      .catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    }
  )
};

exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
  .then(
    (post) => {
      if (!post) {
        res.status(404).json({
          error: new Error('No such Thing!')
        });
      }
      if (post.userId !== req.auth.userId) {
        res.status(400).json({
          error: new Error('Unauthorized request!')
        });
      }
      Post.findOne({ _id: req.params.id })
        .then(post => {
          const filename = post.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Post.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Post deleted !'}))
              .catch(error => res.status(400).json({ error }));
          });
        })
        .catch(error => res.status(500).json({ error }));
    }
  )
};