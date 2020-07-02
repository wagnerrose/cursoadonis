'use strict'
const Task = use('App/Models/Task')
const { validateAll } = use('Validator')

class TaskController {

  async index({ view }) {
    const tasks = await Task.all()
    return view.render('tasks', {
      title: 'Latast tasks',
      tasks: tasks.toJSON()
    })
  }

  async store({ request, response, session }) {
    const task = new Task()
    const rules = {
      title: 'required|min:5|max:140',
      body: 'required|min:10'
    }
    const message = {
      'title.required': "Preenha o Título, por favor.",
      'title.min': "São necessário títulos com no mínimo 5 caracteres.",
      'title.max': "São necessário títulos com no máximo 140 caracteres.",
      'body.required': "Preencha o corpo, por favor.",
      'body.min': "São necessário corpo com no mínimo 10 caracteres."
    }
    const validation = await validateAll(request.all(), rules, message)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashAll()
      return response.redirect('back')
    }

    task.title = request.input('title')
    task.body = request.input('body')

    await task.save()
    session.flash({ notification: 'Task added!' })

    return response.redirect('/tasks')

  }

  async detail({ params, view }) {
    const task = await Task.find(params.id)

    return view.render('detail', {
      task: task
    })
  }

  async remove({ params, response, session }) {
    const task = await Task.find(params.id)

    await task.delete()
    session.flash({ notification: 'Tarefa Removida!' })

    return response.redirect('/tasks')

  }

}

module.exports = TaskController
