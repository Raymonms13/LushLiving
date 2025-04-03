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
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        nama_produk: '',
        deskripsi: '',
        harga: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {
    

    let nama_produk   = req.body.nama_produk;
    let deskripsi = req.body.deskripsi;
    let harga = req.body.harga;
    let errors  = false;

    if(nama_produk.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to add.ejs with flash message
        res.render('posts/create', {
            nama_produk: nama_produk,
            deskripsi: deskripsi,
            harga:harga
        })
    }

    if(deskripsi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('posts/create', {
            nama_produk: nama_produk,
            deskripsi: deskripsi,
            harga: harga
        })
    }

    if(harga.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('posts/create', {
            nama_produk: nama_produk,
            deskripsi: deskripsi,
            harga: harga
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            nama_produk: nama_produk,
            deskripsi: deskripsi,
            harga: harga
        }
        
        // insert query
        connection.query('INSERT INTO posts SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('posts/create', {
                    nama_produk: formData.nama_produk,
                    deskripsi: formData.deskripsi,
                    harga: formData.harga                    
                })
            } else {                
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/posts');
            }
        })
    }

})

/**
 * EDIT POST
 */
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM posts WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan")
            res.redirect('/posts')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('posts/edit', {
                id:      rows[0].id,
                nama_produk:   rows[0].nama_produk,
                deskripsi:   rows[0].deskripsi,
                harga: rows[0].harga
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {

    let id      = req.params.id;
    let nama_produk   = req.body.nama_produk;
    let deskripsi   = req.body.deskripsi;
    let harga = req.body.harga;
    let errors  = false;

    if(nama_produk.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id:         req.params.id,
            nama_produk:      nama_produk,
            deskripsi:      deskripsi,
            harga:    harga
        })
    }

    if(deskripsi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id:         req.params.id,
            nama_produk:      nama_produk,
            deskripsi:      deskripsi,
            harga:    harga
        })
    }
    if(harga.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id:         req.params.id,
            nama_produk:      nama_produk,
            deskripsi:      deskripsi,
            harga:    harga
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            nama_produk:      nama_produk,
            deskripsi:      deskripsi,
            harga:    harga
        }

        // update query
        connection.query('UPDATE posts SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('posts/edit', {
                    id:     req.params.id,
                    name:   formData.name,
                    author: formData.author
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/posts');
            }
        })
    }
})

/**
 * DELETE POST
 */
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    connection.query('DELETE FROM posts WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to posts page
            res.redirect('/posts')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to posts page
            res.redirect('/posts')
        }
    })
})

module.exports = router;