var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM posts ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('posts', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/index', {
                data: rows // <-- data posts
            });
        }
    });
});

/**
 * create posts
 */
router.get('/create',function(req,res,next){
    res.render('posts/create',{
        title: '',
        content: ''
    })
})

/**
 * STORE POSTS
 */
router.post('/store', function (req, res, next) {
    
    let title   = req.body.title;
    let content = req.body.content;
    let errors  = false;

    if(title.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please input some text on Title");
        // render to add.ejs with flash message
        res.render('posts/create', {
            title: title,
            content: content
        })
    }

    if(content.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan input contents");
        // render to add.ejs with flash message
        res.render('posts/create', {
            title: title,
            content: content
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            title: title,
            content: content
        }
        
        // insert query
        connection.query('INSERT INTO posts SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('posts/create', {
                    title: formData.title,
                    content: formData.content                    
                })
            } else {                
                req.flash('success', 'Data is successfully!');
                res.redirect('/posts');
            }
        })
    }

})

/**
 * EDIT posts
 */
router.get('/edit/(:id)',function(req,res,next) {

    let id = req.params.id;

    connection.query('SELECT * FROM posts EHERE id = ' + id,function(err,rows,fields){
        // if there is an error on the query
        if(err) throw err

         // if user not found
         if(rows.length <= 0){
            req.flash('error','Post Data with ID ' + id + ' is not found')
            res.redirect('/posts')
         }
         //if there is a data
         else {
            res.render('posts/edit', {
                id: rows[0].id,
                title: rows[0].title,
                content: rows[0].content
            })
         }


    })
})






module.exports = router;