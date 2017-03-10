#pragma once
#ifndef __MYPTHREAD_H__
#define __MYPTHREAD_H__

#include <thread>
#include <functional>
#include <mutex>
#include <memory>

//////////////////////////////////////////////////////////////////////////
//pthread
typedef std::shared_ptr<std::thread>  my_pthread_t;
typedef std::mutex my_pthread_mutex_t;
typedef int my_pthread_cond_t;
typedef void THREAD_VOID;
typedef struct
{
	int foo;
} my_pthread_attr_t;
void pthread_mutex_init(my_pthread_mutex_t* m, void* attributes);

int pthread_mutex_lock(my_pthread_mutex_t* m);

int pthread_mutex_unlock(my_pthread_mutex_t* m);

void my_pthread_mutex_destroy(my_pthread_mutex_t* m);

int pthread_detach(my_pthread_t thread);

int pthread_join(my_pthread_t thread, void** ret);

int pthread_attr_init(my_pthread_attr_t *attr);

int pthread_attr_destroy(my_pthread_attr_t *attr);

void pthread_exit(void *value_ptr);

//template<class T>
int pthread_create(my_pthread_t *thread, const my_pthread_attr_t *attr, std::function<void* (void*)> start, void *arg);

#endif