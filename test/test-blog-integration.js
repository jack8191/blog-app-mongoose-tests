'use strict';

const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const mongoose = require('mongoose')

const expect = chai.expect

const {BlogPost} = require('../models')
const {app, runServer, closeServer} = require('../server')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHttp);

function seedBlogPostData() {
    console.info('seeding blog post data');
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
      seedData.push({
        author: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName()
        },
        title: faker.lorem.sentence(),
        content: faker.lorem.text()
      });
    }
    // this will return a promise
    return BlogPost.insertMany(seedData);
  }

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Blog API resource', function(){
    before(function() {
        return runServer(TEST_DATABASE_URL)
    })
    beforeEach(function(){
        return seedBlogPostData()
    })
    afterEach(function() {
        return tearDownDb
    })
    after(function(){
        return closeServer()
    })
    
    describe('GET endpoint', function(){
        it('should return all existing posts', function(){
            let res
            return chai.request(app)
            .get('/posts')
            .then(function(_res) {
                res = _res;
                expect(res).to.have.status(200);
                expect(res.body.posts).to.have.lengthOf.at.least(1);
                return BlogPost.count();
                })
        })
    })
    
    
})


