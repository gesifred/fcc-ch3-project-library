/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
    this.timeout(5000);
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post("/api/books")
        .send({
          title:'string'
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.body.title,'string');
          done();
        })
      });
            
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post("/api/books")
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,"missing required field title")
          done();
        })
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .post("/api/books/")
        .send({
          title:"mybook1"
        })
        .end(function(err,res){
          var id = res.body._id;
          chai.request(server)
          .delete("/api/books/"+id)
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,"delete successful")
            done();
          })
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete("/api/books/63e7355af62e4b0fb3d199d4")
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,"no book exists")
          done();
        })
      });

    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'response should be an array')
            done()
          })
      });      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get("/api/books/63e7355af62e4b0fb3d199d4")
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.text,"no book exists");
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .post("/api/books/")
        .send({
          title:"mybook1"
        })
        .end(function(err,res){
          var id = res.body._id;
          //console.log(id)
          chai.request(server)
          .get("/api/books/"+id)
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.title,'mybook1');
            done();
          })
        })
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post("/api/books/")
        .send({
          title:"mybook2"
        })
        .end(function(err,res){
          var id = res.body._id;
          chai.request(server)
          .post("/api/books/"+id)
          .send({
            comment:'123',
          })
          .end(function(err,res){
            assert.equal(res.status,200);
            assert.equal(res.body.title,'mybook2');
            assert.equal(res.body.comments[0],'123');
            done();
          })
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post("/api/books/123")
        .send({
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,'missing required field comment');
          done();
        })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post("/api/books/63e7355af62e4b0fb3d199d4")
        .send({
          comment:'comment123',
        })
        .end(function(err,res){
          assert.equal(res.status,200);
          assert.equal(res.text,'no book exists');
          done();
        })
      });
      
    });

    

  });

});
