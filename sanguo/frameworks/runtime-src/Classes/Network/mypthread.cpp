#include "mypthread.h"

void pthread_mutex_init(my_pthread_mutex_t* m, void* attributes)
{
}

int pthread_mutex_lock(my_pthread_mutex_t* m) {
	m->lock();
	return 0;
}

int pthread_mutex_unlock(my_pthread_mutex_t* m){
	m->unlock();
	return 0;
}

void my_pthread_mutex_destroy(my_pthread_mutex_t* m)
{

}

int pthread_detach(my_pthread_t thread)
{
	if (!thread || !thread->joinable())
	{
		return -1;
	}

	thread->detach();
	return 0;
}

int pthread_join(my_pthread_t thread, void** ret)
{
	if (!thread || !thread->joinable())
	{
		return -1;
	}

	thread->join();
	*ret = 0;
	return 0;
}

int pthread_attr_init(my_pthread_attr_t *attr)
{
	if (attr)
	{
		attr->foo = 0;
	}
	return 0;

}

int pthread_attr_destroy(my_pthread_attr_t *attr)
{
	if (attr)
	{
		attr->foo = 1;
	}
	return 1;

}



void pthread_exit(void *value_ptr)
{
}

//template<class T>
int pthread_create(my_pthread_t *thread, const my_pthread_attr_t *attr, std::function<void* (void*)> start, void *arg)
{
	if ((*thread).use_count() > 0)
	{
		//网络出错或者顶号的时候会出错，此时socket直接中断上个线程并没有被join过，还是joinable的状态
		if ((*thread)->joinable()) 
		{
			(*thread)->join();
		}
	}
	std::shared_ptr<std::thread> t(new std::thread(start, arg));
	//t->joinable();
	//t->detach();
	(*thread).swap(t);
	return 0;
}