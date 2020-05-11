const fs = require('fs')
const data = require('../data.json')
const utils = require('../utils.js')
const Intl = require('intl')

//create
exports.post = (function(req, res){
    
    const keys = Object.keys(req.body)

    for(key of keys){
        if(req.body[key] == ""){
            return res.send('Please, fill all fieds')
        }
    }

    let {avatar_url, name, birth, specialty, type, acom} = req.body

    const id = Number(data.teachers.length + 1)
    const created_at = new Date()
    birth = new Date(birth)

    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        specialty,
        type,
        acom,
        created_at
    })

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err){
        if(err){
            return res.send('Write file error!')
        }
        return res.redirect('/teachers')
    })
})

//show
exports.show = function(req, res){
    const {id} = req.params

    const foundTeachers = data.teachers.find(function(teachers){
        return teachers.id == id
    })

    if(!foundTeachers){
        return res.send('Teacher not found!')
    }

    const teacher = {
        ...foundTeachers,
        age: utils.age(foundTeachers.birth),
        graduation: utils.graduation(foundTeachers.specialty),
        acom: foundTeachers.acom.split(','),
        created_at: Intl.DateTimeFormat('pt-BR').format(new Date(foundTeachers.created_at))
    }

    return res.render('teachers/show', {teacher})
}
//edit
exports.edit = function(req, res){
    const {id} = req.params

    const foundTeachers = data.teachers.find(function(teachers){
        return teachers.id == id
    })

    if(!foundTeachers){
        return res.send('Teacher not found!')
    }

    let {birth} = foundTeachers
    birth = Intl.DateTimeFormat('pt-BR').format(Date.parse(foundTeachers.birth) + 10000000)
    
    const teacher = {
        ...foundTeachers,
        birth: utils.formatDate(birth),
    }
    return res.render('teachers/edit', {teacher})
}
//put
exports.put = function(req, res){
    const {id} = req.body
    let index = 0

    const foundTeachers = data.teachers.find(function(teachers, foundIndex){
        if(id == teachers.id){
            index = foundIndex
            return true
        }
    })

    if(!foundTeachers){
        return res.send('Teacher not found!')
    }

    const teacher = {
        id: Number(id),
        ...foundTeachers,
        birth: new Date(req.body.birth)
    }

    console.log('Deu certo')

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err){
            return res.send("Write file error!")
        }

        return res.redirect(`/teachers/${id}`)
    })
}

//delete
exports.delete = function(req, res){
    const {id} = req.body
    const filteredTeachers = data.teachers.filter(function(teacher){
        return teacher.id != id
    })

    data.teachers = filteredTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err){
            return res.send("Write file error!")
        }

        return res.redirect('/teachers')
    })


}

//Index
exports.index = function(req, res){
    return res.render('teachers/index', {teachers: data.teachers})
}